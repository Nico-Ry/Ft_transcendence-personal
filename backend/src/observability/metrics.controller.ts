import { Controller, Get, Header, Res } from '@nestjs/common';
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../auth/public.decorator';
import { MetricsService } from './metrics.service';

@ApiTags('Observability')
@Controller()
export class MetricsController {
	constructor(
		private readonly metricsService: MetricsService,
	) {}

	/**
	 * Exposes Prometheus metrics.
	 *
	 * This endpoint is intentionally public because
	 * Prometheus must be able to scrape it without
	 * authenticating through the application's JWT flow.
	 */
	@Public()
	@Get('metrics')
	@Header('Content-Type', 'text/plain')
	@ApiOperation({
		summary: 'Expose Prometheus metrics',
	})
	@ApiOkResponse({
		description: 'Metrics returned successfully',
	})
	async getMetrics(
		@Res({ passthrough: true }) res: Response,
	): Promise<string> {
		res.setHeader(
			'Content-Type',
			this.metricsService.getContentType(),
		);

		return this.metricsService.getMetrics();
	}
}
