<?php
// -----------------------------------------------------------------------------
// index.php — Responsive, Zoomable Circle‑Packing Directory Explorer
// - Fills the viewport (uses the smaller of width/height minus padding)
// - Bubbles sized by file size (bytes)
// - Leaf colors keyed to file extension, directories gray
// - Click directory bubble to zoom in; click background to zoom out
// -----------------------------------------------------------------------------

function dirToTree(string $path): array {
    $stat = @stat($path);
    $isDir = is_dir($path);
    $node = [
        'name'  => basename($path) ?: $path,
        'type'  => $isDir ? 'dir' : 'file',
        'ext'   => $isDir ? '' : strtolower(pathinfo($path, PATHINFO_EXTENSION)),
        'size'  => $isDir ? 0 : (filesize($path) ?: 0),
        'ctime' => $stat ? $stat['ctime'] : 0,
        'mtime' => $stat ? $stat['mtime'] : 0,
    ];
    if ($isDir) {
        $node['children'] = [];
        foreach (scandir($path) as $item) {
            if ($item === '.' || $item === '..') continue;
            $child = dirToTree($path . DIRECTORY_SEPARATOR . $item);
            $node['size'] += $child['size'];
            $node['children'][] = $child;
        }
    }
    return $node;
}

$tree = dirToTree(__DIR__);
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Directory Explorer</title>
  <style>
    html,body { width:100%; height:100%; margin:0; }
    body { font-family: Arial, Helvetica, sans-serif; display:flex; flex-direction:column; align-items:center; background:#f7f7f7; }
    h2 { margin:16px 0; text-align:center; }
    #pack { display:block; background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1); cursor:pointer; }
    .text-label { font-size:10px; pointer-events:none; text-anchor:middle; fill:#000; }
  </style>
</head>
<body>
  <h2>Zoomable Circle‑Packing Directory Explorer</h2>
  <svg id="pack"></svg>

  <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <script>
  const data = <?php echo json_encode($tree, JSON_UNESCAPED_SLASHES); ?>;

  const PADDING = 40; // viewport padding
  const diameter = Math.max(300, Math.min(window.innerWidth, window.innerHeight) - PADDING); // min size 300

  const svg = d3.select('#pack')
      .attr('width', diameter)
      .attr('height', diameter)
      .attr('viewBox', `-${diameter/2} -${diameter/2} ${diameter} ${diameter}`);

  const formatBytes = bytes => {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B','KB','MB','GB','TB','PB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(1)+' '+sizes[i];
  };
  const formatDate = ts => new Date(ts*1000).toLocaleString();
  const tooltipText = d => `${d.data.name}\n${formatBytes(d.data.size)}\nCreated: ${formatDate(d.data.ctime)}\nModified: ${formatDate(d.data.mtime)}`;

  const root = d3.hierarchy(data)
      .sum(d => d.size || 0) // bubble size = file size
      .sort((a,b) => b.value - a.value);

  const pack = d3.pack()
      .size([diameter, diameter])
      .padding(3);

  pack(root);

  // Collect file‑extension domain for coloring
  const extSet = new Set(root.leaves().map(d => d.data.ext));
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10.concat(d3.schemeSet3)).domain([...extSet]);
  const fillFn = d => d.children ? '#999' : colorScale(d.data.ext);

  let focus = root;
  let view;

  const node = svg.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
        .attr('pointer-events', d => d.children ? 'all' : 'none')
        .on('click', (event,d) => { if (focus !== d) zoom(event, d), event.stopPropagation(); });

  node.append('circle')
      .attr('stroke', '#555')
      .attr('fill', fillFn)
      .append('title')
      .text(tooltipText);

  node.append('text')
      .attr('class', 'text-label')
      .attr('dy', '0.3em')
      .text(d => d.data.name)
      .style('opacity', d => d.parent === root ? 1 : 0);

  svg.on('click', event => zoom(event, root)); // zoom out on background

  zoomTo([root.x, root.y, root.r * 2]);

  function zoom(event, d) {
    focus = d;
    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween('zoom', () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    node.selectAll('text')
        .filter(function(n) { return n.parent === focus || this.style.opacity === '1'; })
        .transition(transition)
          .style('opacity', n => n.parent === focus ? 1 : 0);
  }

  function zoomTo(v) {
    const k = diameter / v[2];
    view = v;
    node.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.selectAll('circle').attr('r', d => d.r * k);
  }
  </script>
</body>
</html>
