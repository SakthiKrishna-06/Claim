const imaps = require("imap-simple");

async function fetchOtp(host, username, password, subjectKeyword) {

    const config = {
        imap: {
            user: username,
            password: password,
            host: host,
            port: 993,
            tls: true,
            authTimeout: 10000
        }
    };

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = [
        "UNSEEN",
        ["SUBJECT", subjectKeyword]
    ];


    const fetchOptions = {
        bodies: ["TEXT"],
        markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (let i = messages.length - 1; i >= 0; i--) {
        const parts = messages[i].parts;

        for (const part of parts) {
            const emailBody = part.body;

            console.log("Email Content:\n", emailBody);

            const otpMatch = emailBody.match(/\b\d{6}\b/);

            if (otpMatch) {
                await connection.end();
                return otpMatch[0];
            }
        }
    }

    await connection.end();
    throw new Error("OTP not found in inbox!");
}

module.exports = { fetchOtp };