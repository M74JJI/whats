import { Circle, FoldingCube, CubeGrid } from 'better-react-spinkit';
function Loading() {
    return (
        <center
            style={{ display: 'grid', placeItems: 'center', height: '100vh' }}
        >
            <div>
                <img
                    src="https://images.squarespace-cdn.com/content/v1/5c6dd0d07eb88c6d8716a3c1/1593729658470-GLK5BS6VUS6INWKBDJQP/whatsapp.gif?format=1000w"
                    alt=""
                    style={{ marginBottom: 10 }}
                    height={200}
                />
                <CubeGrid color="#52ca5f" size={60} />
            </div>
        </center>
    );
}

export default Loading;
