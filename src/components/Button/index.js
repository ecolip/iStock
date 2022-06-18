/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

const Button = styled.button`
  background: ${(props) => (props.gray ? '#808080' : '#FCD535')};
  margin-top: ${(props) => (props.mt1 ? '50px' : '0')};
  margin-bottom: ${(props) => (props.mb1 ? '30px' : '0')};
  padding: ${(props) => (props.sm ? '12px 0' : props.md ? '8px 25px' : '12px 24px')};
  width: ${(props) => (props.w100 ? '100%' : 'auto')};

  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #FCD535;
    opacity: 0.9;
  }
`;

export default Button;
