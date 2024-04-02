const nfc = require("nfc-pcsc");

nfc.on("reader", (reader) => {
    console.log("Reader connected:", reader.reader.name);

    reader.on("card", (card) => {
        console.log("Card detected:", card.uid);
        console.log("Card type:", card.type);

        // Read NDEF message
        reader.transmit(
            Buffer.from([0xff, 0xb0, 0x00, 0x04, 0x0e]),
            40,
            (err, data) => {
                if (err) {
                    console.error("Error reading NDEF message:", err);
                    return;
                }

                console.log("NDEF message:", data.toString("utf8"));
            }
        );
    });

    reader.on("error", (err) => {
        console.error("Reader error:", err);
    });

    reader.on("end", () => {
        console.log("Reader disconnected");
    });
});

nfc.start();
