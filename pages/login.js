import Head from 'next/head';
import styled from 'styled-components';

import { auth, provider } from '../firebase';
function Login() {
    const SignIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    };
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="https://www.transparentpng.com/thumb/whatsapp/pGdUSs-clipart-png-whatsapp-logotype.png" />
                <Button onClick={SignIn} variant="outlined">
                    <img
                        src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
                        alt=""
                    />{' '}
                    Sign In with Google
                </Button>
            </LoginContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
    background-image: url('https://cdn.wallpapersafari.com/91/2/DExBhK.jpg');
    background-repeat: repeat;
    background-size: contain;
`;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;

    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;

const Button = styled.div`
    cursor: pointer;
    background-color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.3);
    img {
        width: 40px;
    }
`;
