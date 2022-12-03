let initialPageStyles: Pick<
  CSSStyleDeclaration,
  'backgroundColor' | 'filter' | 'transition' | 'opacity'
> | null = null;

export const greyOutBody = () => {
  if (!document.body) {
    return;
  }

  if (initialPageStyles) {
    return;
  }

  initialPageStyles = {
    backgroundColor: document.body.style.backgroundColor,
    filter: document.body.style.filter,
    transition: document.body.style.transition,
    opacity: document.body.style.opacity,
  };

  document.body.style.filter = 'grayscale(100%)';
  document.body.style.transition = 'all 0.5s ease';
  document.body.style.backgroundColor = 'black';
  document.body.style.opacity = '0.6';
};

export const unGreyOutBody = () => {
  if (!initialPageStyles) {
    return;
  }

  if (!document.body) {
    return;
  }

  document.body.style.filter = initialPageStyles.filter;
  document.body.style.transition = initialPageStyles.transition;
  document.body.style.backgroundColor = initialPageStyles.backgroundColor;
  document.body.style.opacity = initialPageStyles.opacity;

  initialPageStyles = null;
};
