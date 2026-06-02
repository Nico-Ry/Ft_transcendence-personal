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
	public readonly authLoginSuccessCounter: Counter<string>;

	/**
	 * Counts failed authentication attempts.
	 *
	 * Example:
	 * Invalid email/password combination.
	 */
	public readonly authLoginFailureCounter: Counter<string>;

	/**
	 * Indicates backend availability.
	 *
	 * Value:
	 * 1 = backend healthy
	 * 0 = backend unavailable
	 */
	public readonly backendUpGauge: Gauge<string>;

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
}
