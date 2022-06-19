/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

const Button = styled.button`
  width: ${(props) => (props.w100 ? '100%' : 'auto')};
  margin-top: ${(props) => (props.mt1 ? '50px' : '0')};
  margin-bottom: ${(props) => (props.mb1 ? '30px' : '0')};
  padding: ${(props) => (props.sm ? '12px 0' : props.md ? '8px 25px' : '12px 24px')};
  color: ${(props) => (props.google ? 'rgb(32, 38, 48)' : '#181A20')};
  background: ${(props) => (props.google ? '#FFFFFF' : '#FCD535')};
  
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.1s linear;
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
