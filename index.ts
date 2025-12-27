import concurrently from 'concurrently';

concurrently([
    {
        name: 'backend',
        command: 'npm run dev',
        cwd: 'packages/backend',
        prefixColor: 'blue',
    },
    {
        name: 'frontend',
        command: 'npm run dev',
        cwd: 'packages/frontend',
        prefixColor: 'green',
    }
])