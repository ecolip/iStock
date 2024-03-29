/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

const Button = styled.button`
  width: ${(props) => (props.w100 ? '100%' : 'auto')};
  margin-top: ${(props) => (props.mt1 ? '50px' : '0')};
  margin-bottom: ${(props) => (props.mb1 ? '30px' : '0')};
  padding: ${(props) => (props.sm ? '12px 0' : props.sm1 ? '7px 20px' : props.md ? '8px 25px' : props.logout ? '3px 15px' : '12px 24px')};
  color: ${(props) => (props.google ? 'rgb(32, 38, 48)' : props.logout ? '#FCD535' : '#181A20')};
  background: ${(props) => (props.google ? '#FFFFFF' : props.logout ? '#0B0E11' : '#FCD535')};
  font-size: ${(props) => (props.logout ? '13px' : '16px')};
  border: ${(props) => (props.logout ? '1px solid #FCD535' : 'none')};
  display: flex;
  justify-content: center;
  align-items: center;
  
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
