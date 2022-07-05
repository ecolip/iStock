import styled from 'styled-components';
import { useScrollToTop } from 'use-scroll-to-top';
import { UpArrowAlt } from '@styled-icons/boxicons-regular';

const StyledArrow = styled(UpArrowAlt)`
  position: fixed;
  width: 40px;
  height: 40px;
  bottom: 12%;
  right: 30px;
  z-index: 100;
  color: #0B0E11;
  background-color: #FCD535;
  border-radius: 50%;
  cursor: pointer;
  animation: fadeIn 0.3s;
  transition: opacity 0.4s;
`;

function ScrollTop() {
  const { showScroll, scrollTop } = useScrollToTop({ pageYOffset: 200 });

  return (
    <StyledArrow
      onClick={scrollTop}
      style={{ display: showScroll ? 'inline' : 'none' }}
    />
  );
}

export default ScrollTop;
