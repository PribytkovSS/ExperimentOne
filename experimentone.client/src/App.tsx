import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
    WebGLRenderer, Scene, PerspectiveCamera, AxesHelper,
    BoxGeometry, BufferGeometry, MeshBasicMaterial, Mesh, Vector3, Line, Material
} from 'three';
import './App.css';


interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function createLine(material: Material): Line {
    const points = [];
    points.push(new Vector3(-3.5, 3, 0));
    points.push(new Vector3(0, 2.8, 0));
    points.push(new Vector3(3.5, 3, 0));

    const geometry = new BufferGeometry().setFromPoints(points);
    return new Line(geometry, material);
}

function createScene(canvasRef: MutableRefObject<HTMLCanvasElement | null>) {
    if (!canvasRef.current) return;

    const WIDTH = canvasRef.current.width;
    const HEIGHT = canvasRef.current.height;

    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(WIDTH, HEIGHT);
   
    const scene = new Scene();
    const cam = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 100);
    const axises = new AxesHelper(5);

    scene.add(axises);
    cam.position.set(0, 2, 7);
    cam.lookAt(0, 0, 0);

    const webGeometry = new BoxGeometry(7, 2, 0.1, 10, 10, 10);
    const flangeGeometry = new BoxGeometry(7, 0.1, 0.5, 10, 10, 10);
    const beamMaterial = new MeshBasicMaterial({ color: 0xAA66AA });
    const web = new Mesh(webGeometry, beamMaterial);
    const upperFlange = new Mesh(flangeGeometry, beamMaterial);
    const lowerFlange = new Mesh(flangeGeometry, beamMaterial);
    web.position.set(0, 0, 0);
    upperFlange.position.set(0, 1, 0);
    lowerFlange.position.set(0, -1, 0);

    const tBeam = [web, upperFlange, lowerFlange];
    const line = createLine(beamMaterial);

    scene.add(web, upperFlange, lowerFlange, line);

    function animate() {
        tBeam.forEach(e => e.rotation.y += 0.01);
        line.rotation.y += 0.01;
        renderer.render(scene, cam);
    }

    renderer.setAnimationLoop(animate);

    return () => {
        renderer.forceContextLoss();
        renderer.dispose();
        tBeam.forEach(e => e.geometry.dispose());
        line.geometry.dispose();
        beamMaterial.dispose();
    };
}

function App() {
    //const [forecasts, setForecasts] = useState<Forecast[]>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        createScene(canvasRef);
    }, []);

    return < canvas ref={canvasRef} width = "500" height = "400" />
  
    /*
    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;
    

    return (
        <div>
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
    */
   /* async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setForecasts(data);
    }*/
}

export default App;