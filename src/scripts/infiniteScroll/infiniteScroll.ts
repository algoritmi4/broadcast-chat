import './observer.scss';

export interface InfiniteScrollOptions {
  list: HTMLElement;
  onUpdate: () => Promise<void>;
  onError: () => void;
  loader: Element;
  sentinelHeight?: number;
}

interface AppendLoader {
  destroyLoader: () => void;
}

interface InfiniteScroll {
  destroy: () => void;
}

const destroyObserver = (
  observer: IntersectionObserver,
  observerTarget: Element,
): void => {
  observer.disconnect();
  observerTarget.remove();
};

const appendLoader = (list: HTMLElement, loader: Element): AppendLoader => {
  list.prepend(loader);

  return { destroyLoader: () => loader.remove() };
};

const initObserverTarget = (height: number): HTMLDivElement => {
  const observerTarget = document.createElement('div');

  observerTarget.classList.add('observer-target');
  observerTarget.style.height = `${height}px`;

  return observerTarget;
};

const correctScrollTop = (
  list: HTMLElement,
  oldScrollHeight: number,
  loader: Element,
): void => {
  const newBlockHeight = list.scrollHeight - oldScrollHeight;

  if (list.scrollTop < 5) {
    const loaderHeight = loader.getBoundingClientRect().height;

    list.scrollTop = list.scrollTop + newBlockHeight - loaderHeight;
  }
};

export const initInfiniteScroll = ({
  list,
  onUpdate,
  onError,
  loader,
  sentinelHeight = 150,
}: InfiniteScrollOptions): InfiniteScroll => {
  let isLoading = false;

  const options = {
    root: list,
  };
  const callback = (entries: IntersectionObserverEntry[]): void => {
    if (isLoading) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isLoading = true;

        const currentScrollHeight = list.scrollHeight;

        const { destroyLoader } = appendLoader(list, loader);

        onUpdate()
          .then(() => {
            requestAnimationFrame(() => {
              correctScrollTop(list, currentScrollHeight, loader);
            });
          })
          .catch(onError)
          .finally(() => {
            destroyLoader();
            isLoading = false;
          });
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  const observerTarget = initObserverTarget(sentinelHeight);

  list.appendChild(observerTarget);

  observer.observe(observerTarget);

  return { destroy: () => destroyObserver(observer, observerTarget) };
};
