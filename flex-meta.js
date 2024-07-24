function translateAlignment(alignment) {
    const alignments = {
        'top': 'flex-start',
        'bottom': 'flex-end',
        'left': 'flex-start',
        'right': 'flex-end',
        'center': 'center',
        'middle': 'center',
    };

    let flexDirection = 'row'; // default flex direction
    let justifyContent = 'flex-start'; // default justify content
    let alignItems = 'flex-start'; // default align items

    // Parse the alignment string
    const alignmentParts = alignment.split(' ');

    // Determine the flex direction
    if (alignmentParts.includes('left') || alignmentParts.includes('right')) {
        flexDirection = 'row';
    } else if (alignmentParts.includes('top') || alignmentParts.includes('bottom')) {
        flexDirection = 'column';
    }

    // Determine the justify content
    if (alignmentParts.includes('left')) {
        justifyContent = 'flex-start';
    } else if (alignmentParts.includes('right')) {
        justifyContent = 'flex-end';
    } else if (alignmentParts.includes('center') || alignmentParts.includes('middle')) {
        justifyContent = 'center';
    }

    // Determine the align items
    if (alignmentParts.includes('top')) {
        alignItems = 'flex-start';
    } else if (alignmentParts.includes('bottom')) {
        alignItems = 'flex-end';
    } else if (alignmentParts.includes('center') || alignmentParts.includes('middle')) {
        alignItems = 'center';
    }

    // Return the translated alignment properties
    return {
        'flex-direction': flexDirection,
        'justify-content': justifyContent,
        'align-items': alignItems,
    };
}

// Example usage:
console.log(translateAlignment('left center')); // { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'center' }
console.log(translateAlignment('top center')); // { 'flex-direction': 'column', 'justify-content': 'flex-start', 'align-items': 'center' }