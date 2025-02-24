// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAILADDRESS,
                pass: process.env.GMAILPASSWORD
            },
        });
    }

    // Email küldése
    async sendVerifyEmail(email: string, context: { name: string, token: string, items: Array<{ id: number, item_id: string, name: string, src: string, isRight: boolean }> } | undefined) {
        const html = await ejs.renderFile(
            path.resolve('./views/passwordResetEmail.ejs'),
            context
        );

        const mailOptions = {
            from: 'Craftdle Support',
            to: email,
            subject: 'Password reset',
            html: html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
    
    async sendAdminVerificationEmail(email: string, context: { code: string, name: string }) {
        const html = await ejs.renderFile(
            path.resolve('./views/adminVerificationEmail.ejs'),
            context
        );

        const mailOptions = {
            from: 'Craftdle Support',
            to: email,
            subject: 'Admin verification',
            html: html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}