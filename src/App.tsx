import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useWindowSize } from "@uidotdev/usehooks";

const MIN_POINTS = 3;
const MAX_POINTS = 42;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledLabel = styled.div`
  margin-block: 1rem;
  justify-self: center;
`;

const StyledInput = styled.input`
  display: block;
`;

const StyledSvg = styled.svg`
  aspect-ratio: 1;
  width: 95vw;
`;

const generateSvg = (size: number, points: number) => {
  const radius = size / 2;
  const coordinates = [...new Array(points)].map((_, index) => {
    const angle = 360 / points;
    const radian = angle * (index + 1);
    return polarToCartesian(radius, radian);
  });
  return coordinates.map((entry1) => {
    const [x1, y1] = entry1;
    return coordinates
      .map((entry2) => {
        const [x2, y2] = entry2;
        if (x1 === x2 && y1 === y2) {
          return "";
        }
        const color = `hsl(${rnd(360)}, ${rnd(100, 50)}%, ${rnd(90, 30)}%)`;
        const width = rnd(30, 3) / 10;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"></line>`;
      })
      .join("");
  });
};

const rnd = (max: number, min: number = 0) =>
  Math.floor(Math.random() * (max - min) + min);

const polarToCartesian = (r: number, degrees: number) => {
  const radians = (degrees * Math.PI) / 180.0;
  return [r + r * Math.cos(radians), r + r * Math.sin(radians)];
};

export const App = () => {
  const [points, setPoints] = useState(16);
  const { height, width } = useWindowSize();
  const svgRef = useRef<SVGSVGElement>(null);
  const roseHeight = (height || 1000) * 0.95;

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = generateSvg(roseHeight, points).join("");
    }
  }, [roseHeight, points]);

  return (
    <Container>
      <StyledLabel>
        Points
        <StyledInput
          type="range"
          min={MIN_POINTS}
          max={MAX_POINTS}
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
        />
      </StyledLabel>
      <StyledSvg ref={svgRef} viewBox={`0 0 ${height} ${width}`} />
    </Container>
  );
};
