<script module>
	import type { RowData2, RowData2Context } from './+page.svelte';
	import type { ICellRendererParams } from '@ag-grid-community/core';

	export interface ExampleCellProps extends ICellRendererParams<RowData2, string, RowData2Context> {
		// (Optional) Add additional props here
		additionalProp1: string;
	}
</script>

<script lang="ts">
	let props: ExampleCellProps = $props();
</script>

<div style="overflow-x: auto;">
	This is an additional prop: '{props.additionalProp1}'. This is a standard ag grid prop: '{props
		.data?.name}'. This is a context prop: '{props.context?.someAdditionalContext}'.
</div>
