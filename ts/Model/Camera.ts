import Game from "./Game";
import Vector from "./Vector";
import Matrix from "./Matrix";

const SPEED = 4.2;

const Offset: Vector = new Vector(0.0, 1.0);

const FULLCIRCLE: number = 2.0 * Math.PI;

let tmp1: Vector = new Vector();
// fixed length arrays
let tmp2: number[] = Object.seal(new Array(0,0));
let tmp3: number[] = Object.seal(new Array(0,0));

export default class Camera {
	public Position: Vector;

	private Velocity: Vector = new Vector();

	private Rotation: number;
	private RotationVelocity: number = 0;

	constructor(x:number, y:number, rotation:number = 0) {
		this.Position = new Vector(x, y);
		this.Rotation = rotation;
	}

	public update(model: Game, t: number): void {
		// update position
		Vector.axpy(t, this.Velocity, this.Position);

		// update rotation
		this.Rotation += t * this.RotationVelocity;
		if (this.Rotation <= 0.0) { this.Rotation += FULLCIRCLE; }

		// update velocity
		if (model.Player.Alive) {
			// new target = new player position

			this.setTarget(model.Player.Position);
		} else {
			let target: Vector = tmp1;
			target.set(0, 0);
			let alive: number = 0;

			model.OnlinePlayers.forEach(p => {
				if (p.Alive) {
					alive++;
					Vector.axpy(1, p.Position, target);
				}
			});

			if (alive > 0) {
				target.scale(1 / alive);
				
				this.setTarget(target);
			} else {
				// slow down
				this.Velocity.scale(0.9);
			}

		}
	}

	public setRotation(alpha: number, time:number = 0): void {
		if (Math.abs(time) < 1e-12) {
			this.Rotation = alpha;
		} else if (time > 0) {
			let delta: number = alpha - this.Rotation;
			let delta2: number = alpha - FULLCIRCLE - this.Rotation;

			// handle wrap-around
			if (Math.abs(delta2) < Math.abs(delta)) { delta = delta2; }

			this.RotationVelocity = delta / time;
		} else {
			this.RotationVelocity = 0;
		}
	}

	private setTarget(target:Vector): void {
		if (target !== tmp1) {
			tmp1.copyFrom(target);
			target = tmp1;
		}

		Vector.axpy(1, Offset, target);

		Vector.axpy2(-1, this.Position, target, this.Velocity);
		limitSpeed(this.Velocity);
	}

	public setViewMatrix(view: Matrix): void {
		// rotation
		view.makeZRotation(this.Rotation);

		// translate so that the fix point is this.Position:

		tmp2[0] = -this.Position.getX();
		tmp2[1] = -this.Position.getY();

		// rotate (matrix x vector multiplication)
		view.xvector(tmp2, tmp3);

		// rotation around this.Position + translation by this.Position
		view.setEntry(0, 3, tmp3[0]);
		view.setEntry(1, 3, tmp3[1]);
	}
}

function limitSpeed(vel:Vector) {
	let l = vel.length();

	if (l > SPEED) {
		vel.scale(SPEED / l);
	}
}