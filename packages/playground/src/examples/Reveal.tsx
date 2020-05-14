import React, {
  Fragment,
  ReactComponentElement,
  ReactHTMLElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Tween, Timeline, Reveal, SplitChars, SplitWords } from 'react-gsap';
import { gsap } from 'gsap';

const RevealStyled = styled.div`
  padding-top: 1000px;
  padding-bottom: 1000px;
  overflow: hidden;

  text-align: center;
  font-family: arial;
  font-size: 80px;

  h1 {
    font-size: 80px;
    font-weight: normal;
    margin: 0;
    padding: 60px 0;
  }

  svg {
    padding: 60px 0;
  }
`;

const FadeIn = ({ children, ...rest }: { children: React.ReactNode; [key: string]: any }) => (
  <Tween from={{ opacity: 0 }} {...rest}>
    {children}
  </Tween>
);

export const FadeInLeft = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Tween
    from={{ opacity: 0, transform: 'translate3d(-100vw, 0, 0)' }}
    ease="power1.inOut"
    {...rest}
  >
    {children}
  </Tween>
);

const RubberBand = ({ children, ...rest }: { children: React.ReactNode; [key: string]: any }) => (
  <Timeline target={children} {...rest}>
    <Tween to={{ scaleX: 1.25, scaleY: 0.75 }} ease="power1.inOut" duration={0.3} />
    <Tween to={{ scaleX: 0.75, scaleY: 1.25 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 1.15, scaleY: 0.85 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 0.95, scaleY: 1.05 }} ease="power1.inOut" duration={0.15} />
    <Tween to={{ scaleX: 1.05, scaleY: 0.95 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 1, scaleY: 1 }} ease="power1.inOut" duration={0.25} />
  </Timeline>
);

export const FadeInLeftChars = ({
  children,
  wrapper,
  ...rest
}: {
  children: React.ReactNode;
  wrapper: ReactComponentElement<any>;
  [key: string]: any;
}) => (
  <Tween from={{ opacity: 0, x: '-100vw' }} ease="power1.inOut" {...rest} stagger={0.1}>
    <SplitChars wrapper={wrapper}>{children}</SplitChars>
  </Tween>
);

export const FadeInLeftWords = ({
  children,
  wrapper,
  ...rest
}: {
  children: React.ReactNode;
  wrapper: ReactComponentElement<any>;
  [key: string]: any;
}) => (
  <Tween from={{ opacity: 0, x: '-100vw' }} ease="power1.inOut" {...rest} stagger={0.5}>
    <SplitWords wrapper={wrapper}>{children}</SplitWords>
  </Tween>
);

const CutText = ({
  children,
  numberSlices = 4,
  type = 0,
  ...rest
}: {
  children: string;
  numberSlices?: number;
  type?: number;
  [key: string]: any;
}) => {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [sliceHeight, setSliceHeight] = useState(0);

  useEffect(() => {
    const boundingBox = textRef.current
      ? textRef.current.getBBox()
      : { x: 0, y: 0, width: 0, height: 0 };
    const { x, y, width, height } = boundingBox;
    setViewBox({ x, y, width, height });

    setSliceHeight(height / numberSlices);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={viewBox.width}
      height={viewBox.height}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
    >
      <defs>
        <pattern
          id="cutPattern"
          patternUnits="userSpaceOnUse"
          width={viewBox.width}
          height={viewBox.height}
          x="0"
          y="0"
        >
          <text ref={textRef} x="0" y={-viewBox.y} textAnchor="left" fontSize="80" fill="#000">
            {children}
          </text>
        </pattern>
      </defs>
      <Timeline
        wrapper={<g fill="url(#cutPattern)" />}
        target={
          <Fragment>
            {Array.from({ length: numberSlices }).map((_, index) => (
              <rect x="0" y={index * sliceHeight} width={viewBox.width} height={sliceHeight + 1} />
            ))}
          </Fragment>
        }
        {...rest}
      >
        {type === 0 && (
          <Tween
            from={{
              x: gsap.utils.wrap([-1000, 1000]),
              ease: 'Back.easeOut',
            }}
            stagger={0.15}
          />
        )}

        {type === 1 && (
          <Tween
            duration={0.4}
            to={{
              x: gsap.utils.wrap([-50, 70, -70, 120]),
              opacity: gsap.utils.wrap([0.5, 0.8]),
            }}
            stagger={-0.05}
            repeat={1}
            repeatDelay={0.2}
            ease="Back.easeInOut"
            yoyoEase="Elastic.easeOut"
          />
        )}
        {type === 2 && (
          <Tween
            duration={0.4}
            to={{
              y: gsap.utils.wrap([-30, -10, 10, 30]),
              repeat: 1,
              repeatDelay: 0.3,
              yoyo: true,
              ease: 'Circ.easeInOut',
            }}
            stagger={0}
          />
        )}
      </Timeline>
    </svg>
  );
};

const RevealComponent = () => (
  <RevealStyled>
    <Reveal repeat>
      <FadeIn duration={2}>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeft>
        <h1>AIIIIIIGHT</h1>
      </FadeInLeft>
    </Reveal>
    <Reveal repeat>
      <RubberBand>
        <h1>ONE MORE</h1>
      </RubberBand>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeftChars wrapper={<h1 style={{ display: 'inline-block' }} />}>
        SPLIT IT UP
      </FadeInLeftChars>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeftWords wrapper={<h1 style={{ display: 'inline-block' }} />}>
        SPLIT IT UP
      </FadeInLeftWords>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={0} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={1} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={2} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
  </RevealStyled>
);

export default RevealComponent;
