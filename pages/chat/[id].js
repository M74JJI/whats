import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getReceivingEmail from '../../utils/getReceivingEmail';

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getReceivingEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    );
}

export default Chat;
export async function getServerSideProps(context) {
    const ref = db.collection('chat').doc(context.query.id);
    const MessagesRes = await ref
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();
    const messages = MessagesRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp?.toDate().getTime(),
        }));
    //chat
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
}
const Container = styled.div`
    max-width: 1400px !important;
    margin: 1rem auto;
    display: flex;

    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.17);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
`;
const ChatContainer = styled.div`
    flex: 1;
    overflow-y: scroll;
    height: calc(100vh - 2rem);
    :-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;
