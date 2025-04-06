from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Flash mesajları için gerekli

# Veritabanı bağlantısı ve tablo oluşturma
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS serial_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Örnek serial code ekleme
def add_serial_code(code):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('INSERT INTO serial_codes (code) VALUES (?)', (code,))
    conn.commit()
    conn.close()

# Ana sayfa ve formu gösterme
@app.route('/')
def index():
    return render_template('index.html')

# Formdan gelen veriyi işleme
@app.route('/verify', methods=['POST'])
def verify():
    serial_code = request.form['serial']
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM serial_codes WHERE code = ?', (serial_code,))
    code = c.fetchone()
    conn.close()

    if code:
        flash('AŞK KODU DOĞRUUU HİHİHİHİ', 'success')
        return redirect(url_for('success'))
    else:
        flash('YETERİNCE AŞIK DEĞİLSİNİZ :( )', 'danger')

    return redirect(url_for('index'))

@app.route('/success')
def success():
    return '''
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YouTube'a Yönlendiriliyorsunuz</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #fd008f, #fd008f);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                color: #fff;
                text-align: center;
            }
            .container {
                background: rgba(255, 155, 176, 0.7); /* Açık pembe arka plan */
                padding: 50px;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
            p {
                font-size: 1.2rem;
            }
            .loader {
                border: 8px solid #f3f3f3;
                border-radius: 50%;
                border-top: 8px solid #fff;
                width: 60px;
                height: 60px;
                animation: spin 2s linear infinite;
                margin: 30px auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>AŞK KODU DOĞRU, SENİ ÇOK SEVİYORUMMMM<3333</h1>
            <p>SENİ HEP ÇOK SEVECEĞİMİ UNUTMA</p>
            <div class="loader"></div>
        </div>
        <script>
            setTimeout(function() {
                window.location.href = 'https://youtu.be/nmIdZozIEW4';
            }, 3000);
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    init_db()
    add_serial_code('S3N1-C0K3-S3V0-0408')  # Örnek serial code ekleniyor
    
    app.run(debug=True)
