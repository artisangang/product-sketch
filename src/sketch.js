import './style.scss';
import {fabric} from 'fabric';


class Sketch {

    constructor(ele) {

        // intiate canvas object
        this.canvas = new fabric.Canvas(ele, {preserveObjectStacking: true});

        // background
        this._bg = null;

        this._bgProperties = {
            angle: 0,
            top: 30,
            left: 30,
            position: 'absolute',
            opacity: 1,
            originX: 'left',
            originY: 'top',
            meetOrSlice: 'slice',

        };

        // manage z-index
        this._index = 1;

        // products collection
        this.products = {};

        this._refresh = 50;

    }

    /**
     * set stage background
     * @param src
     */
    bg(src) {

        this._loadImg(src).then((img) => {

            let imgInstance = new fabric.Image(img, this._bgProperties);

            imgInstance.selectable = true;

            imgInstance.scale(0.5);

            this._bg = imgInstance;

            this.canvas.insertAt(imgInstance, 0);

            this.refresh();

        }).catch(() => {});


    }

    refresh() {
        setTimeout(() => {
            this.canvas.renderAll();
        }, this._refresh);
    }

    /**
     * preload image
     * @param src
     * @param func
     * @private
     */
    _loadImg(src) {

        let img = new Image();
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';

        return new Promise( (resolve, reject) => {

            img.onerror = () => {
                alert('Error loading image:' + img.src);
                reject(img);
            };

            img.onload = () => {
                resolve(img);
            };

        });

    }

    /**
     * add image to canvas
     * @param img
     * @param prop
     * @param func
     * @private
     */
    _addImgToScreen(img, prop, func) {
        let imgInstance = new fabric.Image(img, {
            angle: 0,
            top: 0,
            left: 0,
            width: img.width,
            height: img.height,
            position: 'absolute',
            opacity: 1,
            originX: 'left',
            originY: 'top',
            centeredScaling: true,
            attachments: prop.attachments || {}

        });

        imgInstance.scaleToWidth(prop.scale || 100);

        imgInstance.selectable = prop.selectable || true;

        if (func) {
            func(imgInstance);
        }

        this.canvas.insertAt(imgInstance, prop.index || this._index);

        this.refresh();
        this._index++;
    }

    /**
     * dispatch event
     * @param e
     * @param meta
     * @private
     */
    _dispatch(e, meta) {
        document.dispatchEvent(new CustomEvent(e, {detail: meta}));
    }

    /**
     * add product
     * @param id
     * @param product
     */
    product(id, product) {

        if (typeof product.image == 'undefined') {
            throw new Error('Image property is must in product.');
        }

        this.products[id] = product;

        this._loadImg(product.image).then( (img) => {

            this._addImgToScreen(img, {}, (imgInstance) => {

                imgInstance.on('removed', () => {
                    this._dispatch('sketch.product.removed', product);
                });

            });

            this._dispatch('sketch.product.added', product);
        }).catch(() => {});


    }

    /**
     * add text to canvas
     * @param txt
     * @param size
     */
    text(txt, size) {
        let textbox = new fabric.Textbox(txt, {
            left: 50,
            top: 50,
            width: 150,
            fontSize: size || 20
        });

        textbox.selectable = true;
        this.canvas.add(textbox).setActiveObject(textbox);
    }

    /**
     * remove selected object
     */
    remove() {
        this.canvas.remove(this.canvas.getActiveObject());
    }

    /**
     * add measurement tape
     */
    measurement(text) {

        let lineProps = {
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1,
            hasControls: true,
            hasRotatingPoint: true,
            padding: 0,
            left: 50,
            top: 50,
            scaleX: 3,
            scaleY: 3,
            lockScalingY: true,
        };

        let line1 = new fabric.Line([50, 0, 0, 0], lineProps);

        lineProps.left = 250;
        let line2 = new fabric.Line([50, 0, 0, 0], lineProps);

        let textbox = new fabric.Textbox(text, {
            left: 175,
            top: 60,
            width: 100,
            textAlign: 'center',
            fontSize: 16,
            lockScalingY: true,
            lockScalingX: true,
            centeredScaling: true
        });

        let group = new fabric.Group([line1, line2, textbox], {
            left: 50,
            top: 50,
            angle: 0,
            lockScalingY: true
        });

        this.canvas.add(group);

    }

    /**
     * save canvas
     * @param type
     * @returns {*|String}
     */
    save(type) {
        return this.canvas.toDataURL(type);
    }

}


global.Sketch = Sketch;