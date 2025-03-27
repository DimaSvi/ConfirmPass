const fs = require('fs');
const bcrypt = require('bcrypt');
const prompt = require('prompt');

const PASSWORD_FILE = 'password.txt';
const SALT_ROUNDS = 10;

function askForPassword() {
    return new Promise((resolve, reject) => {
        prompt.get(['password', 'confirmPassword'], (err, result) => {
            if (err) reject(err);
            if (result.password !== result.confirmPassword) {
                console.log('Паролі не співпадають!');
                process.exit(1);
            }
            resolve(result.password);
        });
    });
}

function askForPasswordInput() {
    return new Promise((resolve, reject) => {
        prompt.get(['password'], (err, result) => {
            if (err) reject(err);
            resolve(result.password);
        });
    });
}

async function main() {
    prompt.start();
    
    if (fs.existsSync(PASSWORD_FILE)) {
        const storedHash = fs.readFileSync(PASSWORD_FILE, 'utf8').trim();
        if (storedHash) {
            console.log('Введіть пароль для перевірки:');
            const password = await askForPasswordInput();
            const match = await bcrypt.compare(password, storedHash);
            if (match) {
                console.log('✅ Пароль вірний!');
            } else {
                console.log('❌ Неправильний пароль!');
            }
            return;
        }
    }

    console.log('Файл пароля не знайдено або він пустий. Створення нового пароля:');
    const password = await askForPassword();
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    fs.writeFileSync(PASSWORD_FILE, hash);
    console.log('✅ Пароль успішно збережено!');
}

main().catch(console.error);