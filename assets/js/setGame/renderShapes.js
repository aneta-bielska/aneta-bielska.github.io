export const renderCard = (card) => {
  if (card.status === 'empty') {
    return `<div class="card empty-card"></div>`;
  }

  let cardItems = '';
  for (let i = 0; i < card.number; i++) {
    cardItems += renderCardShape(card.id, card.shape, card.color, card.filling);
  }

  return `
    <div class="card"
         data-card-id="${card.id}"
         style="border-color: ${card.set ? 'lightpink' : 'darkgrey'}">
      ${cardItems}
    </div>
  `;
};

const renderCardShape = (id, shape, color, filling) => {
  const fillingMap = {
    1: 'none',
    2: 'striped',
    3: color
  };

  if (shape === 1) {
    return shapeOne(id, color, fillingMap[filling]);
  } else if (shape === 2) {
    return shapeTwo(id, color, fillingMap[filling]);
  } else {
    return shapeThree(id, color, fillingMap[filling]);
  }
};

const shapeOne = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="react-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <rect width="80" height="40" x="10" y="30"
            style="
              stroke: ${color};
              fill: ${filling === 'striped' ? `url(#react-stripes-${id})` : filling};
              stroke-width: 6"/>
    </svg>
  `;
};

const shapeTwo = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="ruby-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <circle cx="50" cy="50" r="30"
              style="
                stroke: ${color};
                fill: ${filling === 'striped' ? `url(#ruby-stripes-${id})` : filling};
                stroke-width: 6"/>
    </svg>
  `;
};

const shapeThree = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="gh-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <polygon points="50,20 20,80 80,80"
               style="
                 stroke: ${color};
                 fill: ${filling === 'striped' ? `url(#gh-stripes-${id})` : filling};
                 stroke-width: 6"/>
    </svg>
  `;
};
