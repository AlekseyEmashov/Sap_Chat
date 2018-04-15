sap.ui.define([
    "sap/ui/core/mvc/Controller",

], function (Controller) {
    'use strict';
    var ws;

    return Controller.extend('sample.app.controller.App', {

        onInit: function () {
            var view = this.getView();
            ws = new WebSocket("ws://localhost:3001");
            ws.onopen = function () {
                console.log("Connected");
            };

            ws.onmessage = function (event) {

                var message = JSON.parse(event.data);
                var messageBlock = view.byId("messageContent");
                messageBlock.insertItem(
                    new sap.m.Text({
                        text: message.user + ": " + message.message
                    })
                )

            }
        },

        onMessageDialogPress: function () {
            var view = this.getView();
            view.byId('dialog').open();
        },

        authorization: function () {
            var view = this.getView();
            var userNickname = view.byId('login').getValue();
            view.byId('nick').setText(userNickname);
            view.byId('dialog').destroy();
        },

        onSendMessage: function() {

            var view = this.getView();
            var user = view.byId("nick").getText();
            var message = view.byId("message").getValue();

            if (message === '') {
                alert("Введите сообщение!");
            } else if (user === ''){
                alert("Войдите!");
            } else {

                ws.send(JSON.stringify({
                    user: user,
                    message: message
                }));
                view.byId("message").setValue('');
            }
        }
    });

});


