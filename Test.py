__author__ = 'Codengine'

class Mail:
    def send_mail(self, message):

        import smtplib
        from email.MIMEMultipart import MIMEMultipart
        from email.MIMEText import MIMEText

        gmailUser = 'codenginebd@gmail.com'
        gmailPassword = 'lapsso065Commlink'
        recipient = 'xyz@gmail.com'

        msg = MIMEMultipart()
        msg['From'] = gmailUser
        msg['To'] = recipient
        msg['Subject'] = "Success of mail "
        msg.attach(MIMEText(message))

        mailServer = smtplib.SMTP('smtp.gmail.com', 587)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        mailServer.login(gmailUser, gmailPassword)
        mailServer.sendmail(gmailUser, recipient, msg.as_string())
        mailServer.close()


m = Mail()
m.send_mail('your messgae')
