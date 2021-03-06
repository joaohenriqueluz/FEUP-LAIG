/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
    constructor(scene, x1, x2, y1, y2) {
        super(scene);
        this.tiles = [];
        this.pieces = [];
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.content = this.emptyBoard();
        this.initBoard();
        this.createTiles();
        this.initMaterials();
        console.log(this.tiles);
        this.initPieces();
    }
    initMaterials() {
        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setAmbient(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setShininess(10.0);
        this.tex = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.boardMaterial.setTexture(this.tex);
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    initBoard() {
        let controlPoints = [  // U = 0 
            [ // V = 0..2
                [this.x1, this.y1, 0, 1],
                [this.x1, 0, 0, 1],
                [this.x1, this.y2, 0, 1]
            ],
            // U = 1
            [ // V = 0..2
                [0, this.y1, 0, 1],
                [0, 0, 0, 1],
                [0, this.y2, 0, 1]
            ],
            // U = 2
            [ // V = 0..2
                [this.x2, this.y1, 0, 1],
                [this.x2, 0, 0, 1],
                [this.x2, this.y2, 0, 1]
            ]
        ];

        this.patch = new MyPatch(this.scene, 3, 3, 10, 10, controlPoints);
        this.boarder = new MyRectangle(this.scene, this.x1, this.x2, -0.2, 0);

    }
    createTiles() {
        let tileWidth = Math.abs(this.x2 - this.x1) / 4;
        for (let i = 0; i < 4; i++) {
            this.tiles[i] = new Array(4);
            for (let j = 0; j < 4; j++) {
                this.tiles[i][j] = new MyTile(this.scene, (i * 4) + (j + 1), null, this, this.x1 + j * tileWidth, -this.y1 - (i + 1) * tileWidth, tileWidth);
            }
        }
    }
    displayTiles() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tiles[i][j].piece == null) {
                    this.scene.registerForPick(this.scene.indexForPick++, this.tiles[i][j]);
                    this.tiles[i][j].display();
                }
            }
        }
    }
    initPieces() {
        let increment = 1;
        for (let i = 1; i <= 2; i++) {
            this.pieces["cylinder1" + "p" + i] = new MyCylinderPiece(this.scene, "cylinder1", null, i, -10 * increment, 0, 11 * increment);
            this.pieces["cylinder2" + "p" + i] = new MyCylinderPiece(this.scene, "cylinder2", null, i, -8 * increment, 0, 11 * increment);
            this.pieces["sphere1" + "p" + i] = new MySpherePiece(this.scene, "sphere1", null, i, -10 * increment, 0, 9 * increment);
            this.pieces["sphere2" + "p" + i] = new MySpherePiece(this.scene, "sphere2", null, i, -8 * increment, 0, 9 * increment);
            this.pieces["cube1" + "p" + i] = new MyCubePiece(this.scene, "cube1", null, i, -10 * increment, 0, 7 * increment);
            this.pieces["cube2" + "p" + i] = new MyCubePiece(this.scene, "cube2", null, i, -8 * increment, 0, 7 * increment);
            this.pieces["cone1" + "p" + i] = new MyConePiece(this.scene, "cone1", null, i, -10 * increment, 0, 5 * increment);
            this.pieces["cone2" + "p" + i] = new MyConePiece(this.scene, "cone2", null, i, -8 * increment, 0, 5 * increment);
            increment = -1;
        }
    }
    displayPieces() {
        for (let piece in this.pieces) {
            if (this.scene.pickMode) {
                if (this.pieces[piece].tile == null) {
                    this.scene.registerForPick(this.scene.indexForPick++, this.pieces[piece]);
                    this.pieces[piece].display();
                }
            } else {
                this.pieces[piece].display();
            }
        }
    }

    display() {
        if (!this.scene.pickMode) {
            this.boardMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.patch.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, -0.2, 0);
            this.scene.rotate(-3 * Math.PI / 2, 1, 0, 0);
            this.patch.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, 0, 6);
            this.boarder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(6, 0, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, 0, -6);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-6, 0, 0);
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();
            this.scene.popMatrix();
        }
        else {
            this.displayTiles();
        }

        this.displayPieces();
    }

    getPiece(piece_id) {
        return this.pieces[piece_id];
    }
    getTile(tile_id) {
        let newT = tile_id - 1;
        return this.tiles[Math.floor(newT / 4)][newT % 4];
    }
    addPieceToTile(piece, tile) {
        tile.piece = piece;
        piece.tile = tile;

        piece.x = tile.x + tile.width / 2;
        piece.y += 0.2;
        piece.z = -tile.y - tile.width / 2;
    }
    //TODO: Needed?
    removePieceFromTile(piece, tile) {
        tile.piece = null;
        piece.tile = null;
        piece.x = piece.initialPosition["x"];
        piece.y = piece.initialPosition["y"];
        piece.z = piece.initialPosition["z"];
    }
    getPieceOfTile(tile) {
        tile.piece;
    }
    getTileofPiece(piece) {
        piece.tile;
    }
    movePiece(piece, tile) {
        this.addPieceToTile(piece, tile);
    }
    getTileWithCoordinates(tile_id) {
        let newT = tile_id - 1;
        return [Math.floor(newT / 4) + 1, newT % 4 + 1];
    }

    emptyBoard() {
        return "[[empty,empty,empty,empty],[empty,empty,empty,empty],[empty,empty,empty,empty],[empty,empty,empty,empty]]";
    }
}