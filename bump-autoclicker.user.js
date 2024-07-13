// ==UserScript==
// @name         BUMP Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.bump.sh/*
// @author       mudachyo (modified)
// @version      1.2
// @description  13.07.2024, Autoclicker for BUMP
// @grant        none
// @icon         https://www.softportal.com/en/scr/1089/icons/icon_src.png
// @downloadURL  https://github.com/yourusername/BUMP/raw/main/bump-autoclicker.user.js
// @updateURL    https://github.com/yourusername/BUMP/raw/main/bump-autoclicker.user.js
// @homepage     https://github.com/yourusername/BUMP
// ==/UserScript==

const minClickDelay = 30;
const maxClickDelay = 50;
const checkInterval = 1500;
const maxCheckAttempts = 3;

let checkAttempts = 0;

const styles = {
    success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};
const logPrefix = '%c[BUMPBot] ';

const originalLog = console.log;
console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[BUMPBot]')) {
        originalLog.apply(console, arguments);
    }
};

console.error = console.warn = console.info = console.debug = () => { };

console.clear();
console.log(`${logPrefix}Starting`, styles.starting);
console.log(`${logPrefix}Modified for BUMP central circle`, styles.starting);

function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1);
    return {
        x: Math.round(x * radius),
        y: Math.round(y * radius)
    };
}

function checkCircleAndClick() {
    const circle = document.querySelector("div[style*='border-radius: 50%']"); // Селектор для круглого элемента

    if (circle) {
        console.log(`${logPrefix}Central circle found. The click is executed.`, styles.success);
        clickInCircle(circle);
    } else {
        checkAttempts++;
        if (checkAttempts >= maxCheckAttempts) {
            console.log(`${logPrefix}Central circle not found after ${maxCheckAttempts} attempts. Reloading the page.`, styles.error);
            location.reload();
        } else {
            console.log(`${logPrefix}Central circle not found. Attempt ${checkAttempts}/${maxCheckAttempts}. Check again after ${checkInterval/1000} seconds.`, styles.error);
            setTimeout(checkCircleAndClick, checkInterval);
        }
    }
}

function clickInCircle(circle) {
    const rect = circle.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2;
    const { x, y } = getRandomCoordinateInCircle(radius);

    const clientX = rect.left + radius + x;
    const clientY = rect.top + radius + y;

    const commonProperties = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: clientX,
        clientY: clientY,
        screenX: clientX,
        screenY: clientY,
        pageX: clientX,
        pageY: clientY,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        width: 1,
        height: 1,
        pressure: 0.5,
        button: 0,
        buttons: 1
    };

    triggerEvent(circle, 'pointerdown', commonProperties);
    triggerEvent(circle, 'mousedown', commonProperties);
    triggerEvent(circle, 'pointerup', { ...commonProperties, pressure: 0 });
    triggerEvent(circle, 'mouseup', commonProperties);
    triggerEvent(circle, 'click', commonProperties);

    const delay = minClickDelay + Math.random() * (maxClickDelay - minClickDelay);
    setTimeout(checkCircleAndClick, delay);
}

checkCircleAndClick();
