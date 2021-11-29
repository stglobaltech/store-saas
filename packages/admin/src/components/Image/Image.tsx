import React, { Suspense } from 'react';
import { useImage } from 'react-image';
import placeholder from './product-placeholder.png';
const Placeholder = () => <img src={placeholder} alt="placeholder" />;
export default function Image({
  key,
  url,
  alt,
  unloader,
  loader,
  className,
  style,
}: {
  key?: any;
  url?: string | [string];
  alt?: string;
  unloader?: string;
  loader?: string;
  className?: string;
  style?: any;
}) {

  const ImageComponent = () => {
    const { src } = useImage({
      srcList: url
    });
   
    return <img
            key={key}
            src={src}
            alt={alt}
            className={className}
            style={style}
            draggable={false}
          />
  };

  return (
    <Suspense fallback={<Placeholder />}>
      <ImageComponent />
    </Suspense>
  );
}
