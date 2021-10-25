import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

function Right() {
    const { darkTheme } = useSelector((state) => ({ ...state }));
    return (
        <Container style={{ background: darkTheme && '#222f37' }}>
            <Wrapper>
                <Img>
                    {darkTheme ? (
                        <img src="../dark.jpg" />
                    ) : (
                        <img src="../lite.jpg" alt="" />
                    )}
                </Img>
                <Text1 style={{ color: darkTheme && '#fff' }}>
                    Keep your phone connected
                </Text1>
                <TextSmall style={{ color: darkTheme && '#fff' }}>
                    WhatsApp connects to your phone to sync messages. To reduce
                    data usage, connect your phone to Wi-Fi.
                </TextSmall>
                <Line></Line>
                <Bottom style={{ color: darkTheme && '#fff' }}>
                    <svg viewBox="0 0 21 18" width="21" height="18">
                        <path
                            fill="currentColor"
                            d="M10.426 14.235a.767.767 0 0 1-.765-.765c0-.421.344-.765.765-.765s.765.344.765.765-.344.765-.765.765zM4.309 3.529h12.235v8.412H4.309V3.529zm12.235 9.942c.841 0 1.522-.688 1.522-1.529l.008-8.412c0-.842-.689-1.53-1.53-1.53H4.309c-.841 0-1.53.688-1.53 1.529v8.412c0 .841.688 1.529 1.529 1.529H1.25c0 .842.688 1.53 1.529 1.53h15.294c.841 0 1.529-.688 1.529-1.529h-3.058z"
                        ></path>
                    </svg>
                    Make calls from desktop with WhatsApp for Windows.
                    <a
                        href="https://www.whatsapp.com/download"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Get it here
                    </a>
                </Bottom>
            </Wrapper>
        </Container>
    );
}

export default Right;

const Container = styled.div`
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 2rem);
    background-color: #f8f9fa;
    overflow: hidden;
    border-bottom: 6px solid #4adf83;
`;

const Wrapper = styled.div`
    margin-top: -20px;
    text-align: center;
    width: 80%;
    max-width: 540px;
`;
const Img = styled.div`
    pointer-events: none;
    user-select: none;
    img {
        width: 356px;
        height: 355px;
    }
`;
const Text1 = styled.h1`
    font-size: 32px;
    font-size: 36px;
    font-weight: 300;
    color: #525252; ;
`;

const TextSmall = styled.div`
    margin-top: 18px;
    font-size: 14px;
    line-height: 20px;
    color: rgb(0, 0, 0, 0.45);
`;

const Line = styled.div`
    height: 1px;
    width: 400px;
    background-color: rgba(0, 0, 0, 0.08);
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;
const Bottom = styled.div`
    display: inline-flex;
    align-items: center;
    column-gap: 5px;
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.45);
    a {
        color: #0aa545;
        text-decoration: none;
    }
`;
