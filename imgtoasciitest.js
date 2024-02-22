import asciify from 'asciify-image';

var options = {
    fit: 'box',
    width: 20,
    height: 20
}

asciify('https://w7.pngwing.com/pngs/386/199/png-transparent-super-mario-bros-minecraft-pixel-art-mario-heroes-text-super-mario-bros-thumbnail.png', options, function (err, asciified) {
    if (err) throw err;

    // Print to console
    console.log(asciified);
});