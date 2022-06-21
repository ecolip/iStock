import styled from 'styled-components';

const style = {
  width: '50px',
  height: '50px',
};

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Loading() {
  return (
    <ProgressContainer>
      <div className="spinner-border text-warning" style={style} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </ProgressContainer>
  );
}

export default Loading;
