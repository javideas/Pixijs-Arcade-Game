import { gsap } from 'gsap';
import { Container } from 'pixi.js';
import { Shooter } from "./shooter";

export class Enemy extends Shooter {
    constructor(
        scaleRatio: number = 1,
        health: number,
        initPosAccX?: number,
        initPosAccY?: number,
        fireRate: number = 15,
        debugBgColor: string = 'green'
    ) {
        super(
            'enemy',
            true, // hasAi
            scaleRatio,
            health,
            initPosAccX,
            initPosAccY,
            fireRate,
            debugBgColor
        );
    }

    private init() {
        super.init();
        this.initPlacement();
    }

    private initPlacement() {
        // Create a timeline for the animations
        const tl = gsap.timeline({ onUpdate: () => this.setResponsive() });

        // Simultaneous initial animations for posAccX and posAccY
        tl.to(this, {
            posAccX: 0,
            duration: 2,
            ease: 'power3.out'
        }, 0)

        .to(this, {
            posAccY: -0.5,
            duration: 2,
            ease: 'power2.in'
        }, 0);

        tl.to(this, {
            posAccX: -0.85,
            duration: 2,
            ease: 'power2.inOut'
        }, '+=0')

        tl.to(this, {
            posAccY: 0,
            duration: 3,
            ease: 'power3.inOut'
        }, '-=2.9')

        // Total duration for posAccY movement
        const totalYDuration = 11;

        tl.to(this, {
            posAccX: 0.85,
            duration: 1,
            ease: 'sine.inOut',
            repeat: totalYDuration - 1,
            yoyo: true
        }, '-=1')

        .to(this, {
            posAccY: 0.8,
            duration: 6.5,
            ease: 'sine.inOut'
        }, '-=13')

        .to(this, {
            posAccY: -0.8,
            duration: 6,
            ease: 'sine.inOut'
        }, '-=7.5')

        tl.to(this, {
            posAccX: -2,
            duration: 2,
            ease: 'power2.out'
        }, '-=1');
    }
}