import nodemailer from "nodemailer";

export const makeConfirmationMail = (address, name, confirmationHash) => {
    return {
        from: {
            name: '知識家2.0',
            address: '2.0answers2.0@gmail.com'
        },
        to: address,
        subject: "完成你在知識家2.0註冊",
        html: `<p>哈囉 ${name}, 按<a href="https://answers2.herokuapp.com/api/confirm?confirmationHash=${confirmationHash}">這裡</a>完成帳號認證</p><br>
        <p>你會收到這封郵件是因為你在知識家2.0完成帳號註冊</p><br>
        <p>如果你沒有印象有進行這樣的動作，請透過2.0answers2.0@gmail.com向我們連繫</p>`
    }
}

export const makeRestPasswordMail = (address, name, newPassword) => {
    return {
        from: {
            name: '知識家2.0',
            address: '2.0answers2.0@gmail.com'
        },
        to: address,
        subject: "你在知識家2.0的密碼",
        html: `<p>哈囉 ${name}，你在知識家2.0的密碼已經被重設為${newPassword}，請盡速<a href="https://answers2.herokuapp.com/">登入</a>並設定新密碼</p><br>
        <p>你會收到這封郵件是因為你忘記了知識家2.0帳號的密碼，並要求重設密碼</p><br>
        <p>如果你沒有印象有進行這樣的動作，請透過2.0answers2.0@gmail.com向我們連繫</p>`
    }
}

export const makeTransporter = (service, user, pass) => {
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            pass: pass
        }
    })
}

export const sendMail = (transporter, mail) => {
    transporter.sendMail(mail, (error, response) => {
        if(error) {
            console.log('error has occurred', error);
        }
        else {
            console.log('mail send to', mail.to);
        }
    })
}