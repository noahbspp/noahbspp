   document.addEventListener('DOMContentLoaded', () => {
            const output = document.getElementById('output');
            const commandInput = document.getElementById('commandInput');
            let commandHistory = [];
            let historyIndex = -1;

            commandInput.focus();

            commandInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = commandInput.value.trim();
                    if (command) {
                        commandHistory.push(command);
                        historyIndex = commandHistory.length;
                        output.innerHTML += `<div><span class="prompt">user@terminal:~$ </span>${command}</div>`;
                        const result = executeCommand(command);
                        output.innerHTML += `<div>${result}</div>`;
                        output.scrollTop = output.scrollHeight; // Scroll to the bottom
                    }
                    commandInput.value = '';
                } else if (e.key === 'ArrowUp') {
                    if (historyIndex > 0) {
                        historyIndex--;
                        commandInput.value = commandHistory[historyIndex];
                    }
                } else if (e.key === 'ArrowDown') {
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        commandInput.value = commandHistory[historyIndex];
                    }
                }
            });

            function executeCommand(command) {
                const args = command.split(' ');
                const cmd = args.shift();

                switch (cmd) {
                    case 'echo':
                        return args.join(' ');
                    case 'date':
                        return new Date().toString();
                    case 'help':
                        return `Available commands: echo, date, ls, ll, la, cls`;
                    case 'ls':
                        return 'file1.txt\nfile2.txt\ndirectory1';
                    case 'll':
                        return 'total 8\n-rw-r--r-- 1 user user 4096 Jan  1 12:00 file1.txt\n-rw-r--r-- 1 user user 4096 Jan  1 12:00 file2.txt\ndrwxr-xr-x 2 user user 4096 Jan  1 12:00 directory1';
                    case 'la':
                        return 'total 8\n-rw-r--r-- 1 user user 4096 Jan  1 12:00 .file1.txt\n-rw-r--r-- 1 user user 4096 Jan  1 12:00 ..file2.txt\ndrwxr-xr-x 2 user user 4096 Jan  1 12:00 .directory1';
                    case 'cls':
                        output.innerHTML = '';
                        return '';
                    default:
                        return `bash: ${command}: command not found`;
                }
            }
        });