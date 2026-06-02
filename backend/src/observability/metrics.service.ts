import { Injectable } from '@nestjs/common';
import {
	Counter,
	Gauge,
	Registry,
	collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
	private readonly registry: Registry;

	/**
	 * Counts successful authentication events.
	 *
	 * Example:
	 * User enters valid credentials and receives a session.
	 */
	private readonly authLoginSuccessCounter: Counter<string>;

	/**
	 * Counts failed authentication attempts.
	 *
	 * Example:
	 * Invalid email/password combination.
	 */
	private readonly authLoginFailureCounter: Counter<string>;

	/**
	 * Indicates backend availability.
	 *
	 * Value:
	 * 1 = backend healthy
	 * 0 = backend unavailable
	 */
	private readonly backendUpGauge: Gauge<string>;

	/**
	 * Counts requests rejected because no JWT was provided.
	 */
	private readonly jwtMissingTokenCounter: Counter<string>;

	/**
	 * Counts requests rejected because the JWT is invalid.
	 */
	private readonly jwtInvalidTokenCounter: Counter<string>;

	/**
	 * Counts invalid 2FA code submissions.
	 */
	private readonly twoFactorInvalidCodeCounter: Counter<string>;

	/**
	 * Counts temporary 2FA lockouts.
	 */
	private readonly twoFactorLockoutCounter: Counter<string>;

	constructor() {
		this.registry = new Registry();

		/**
		 * Registers default Node.js process metrics.
		 *
		 * Examples:
		 * - CPU usage
		 * - Memory usage
		 * - Event loop latency
		 * - Process uptime
		 *
		 * These metrics are useful for monitoring
		 * application performance and resource consumption.
		 */
		collectDefaultMetrics({
			register: this.registry,
		});

		this.authLoginSuccessCounter = new Counter({
			name: 'auth_login_success_total',
			help: 'Total successful login attempts',
			registers: [this.registry],
		});

		this.authLoginFailureCounter = new Counter({
			name: 'auth_login_failure_total',
			help: 'Total failed login attempts',
			registers: [this.registry],
		});

		this.jwtMissingTokenCounter = new Counter({
			name: 'jwt_missing_token_total',
			help: 'Total requests rejected due to missing JWT',
			registers: [this.registry],
		});

		this.jwtInvalidTokenCounter = new Counter({
			name: 'jwt_invalid_token_total',
			help: 'Total requests rejected due to invalid JWT',
			registers: [this.registry],
		});

		this.twoFactorInvalidCodeCounter = new Counter({
			name: 'twofa_invalid_code_total',
			help: 'Total invalid 2FA codes submitted',
			registers: [this.registry],
		});

		this.twoFactorLockoutCounter = new Counter({
			name: 'twofa_lockout_total',
			help: 'Total 2FA temporary lockouts',
			registers: [this.registry],
		});

		this.backendUpGauge = new Gauge({
			name: 'backend_up',
			help: 'Backend availability',
			registers: [this.registry],
		});

		/**
		 * Backend started successfully.
		 *
		 * A value of 1 indicates the service is currently running.
		 */
		this.backendUpGauge.set(1);
	}

	/**
	 * Returns all registered Prometheus metrics.
	 *
	 * @returns Metrics formatted using the Prometheus exposition format.
	 */
	async getMetrics(): Promise<string> {
		return this.registry.metrics();
	}

	/**
	 * Returns the correct Content-Type header
	 * required by Prometheus.
	 *
	 * @returns Prometheus metrics content type.
	 */
	getContentType(): string {
		return this.registry.contentType;
	}

	/**
	 * Records a successful authentication event.
	 *
	 * @returns Nothing.
	 */
	recordLoginSuccess(): void {
		this.authLoginSuccessCounter.inc();
	}

	/**
	 * Records a failed authentication event.
	 *
	 * @returns Nothing.
	 */
	recordLoginFailure(): void {
		this.authLoginFailureCounter.inc();
	}

	/**
	 * Records a missing JWT authentication failure.
	 */
	recordMissingToken(): void {
		this.jwtMissingTokenCounter.inc();
	}

	/**
	 * Records an invalid JWT authentication failure.
	 */
	recordInvalidToken(): void {
		this.jwtInvalidTokenCounter.inc();
	}

	/**
	 * Records an invalid TOTP submission.
	 */
	recordTwoFactorInvalidCode(): void {
		this.twoFactorInvalidCodeCounter.inc();
	}

	/**
	 * Records a 2FA lockout event.
	 */
	recordTwoFactorLockout(): void {
		this.twoFactorLockoutCounter.inc();
	}
}
