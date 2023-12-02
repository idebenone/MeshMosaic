export const generatePoints = {
    "generateRandomPointInSphere": (radius) => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        return { x, y, z };
    },

    "generateUniformPointsInSphere": (radius, numberOfPoints, gR) => {
        const points = [];
        const goldenRatio = (1 + Math.sqrt(gR)) / 2;
        for (let i = 0; i < numberOfPoints; i++) {
            const theta = 2 * Math.PI * (i / goldenRatio);
            const phi = Math.acos(1 - (2 * (i + 0.5)) / numberOfPoints);
            const r = Math.cbrt(Math.random()) * radius;
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            points.push([x, y, z]);
        }
        return points;
    }
}