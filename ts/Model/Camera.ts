import Model from "./Model";
import Vector from "./Vector";
import Matrix from "./Matrix";

const SPEED = 4.2;

const Offset: Vector = new Vector(0.0, 1.0);

let tmp: Vector = new Vector();

export default class Camera {
	public Position: Vector = new Vector();

	public Velocity: Vector = new Vector();

	public update(model: Model, t: number): void {
		// update position
		Vector.axpy(t, this.Velocity, this.Position);

		// update velocity
		if (model.Player.Alive) {
			// new target = new player position

			this.setTarget(model.Player.Position);
		} else {
			let target: Vector = tmp;
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

	private setTarget(target:Vector): void {
		if (target !== tmp) {
			tmp.copyFrom(target);
			target = tmp;
		}

		Vector.axpy(1, Offset, target);

		Vector.axpy2(-1, this.Position, target, this.Velocity);
		limitSpeed(this.Velocity);
	}

	public setViewMatrix(view: Matrix, model: Model): void {
		// rotation
		view.makeZRotation(model.Rotation);
		// translation
		view.setEntry(0, 3, -this.Position.getX());
		view.setEntry(1, 3, -this.Position.getY());
	}
}

function limitSpeed(vel:Vector) {
	let l = vel.length();

	if (l > SPEED) {
		vel.scale(SPEED / l);
	}
}