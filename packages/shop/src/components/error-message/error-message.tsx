import styled from 'styled-components';
export default function ErrorMessage({ children }) {
  return <StyledAside>{children}</StyledAside>;
}

const StyledAside = styled.aside({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  padding: '1.5rem',
  fontSize: 'xl',
  color: 'black',
  backgroundColor: '#fff',
});
