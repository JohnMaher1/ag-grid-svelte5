<script module>
	import { SvelteRendererComp } from '$lib/custom-cell-renderer-comp.js';
	import type { ICellRendererParams } from '@ag-grid-community/core';
	import { mount } from 'svelte';
	import Test from './ExampleCustomCell.svelte';
	import type { RowData2, RowData2Context } from './+page.svelte';

	export class ExampleCustomCellComp extends SvelteRendererComp {
		render() {
			// Unmount is handled is base class.
			this.comp = mount(Test, {
				target: this.eGui!,
				props: this.params
			});
		}
	}
</script>

<script lang="ts">
	let props: ICellRendererParams<RowData2, string, RowData2Context> = $props();
</script>

<div>
	Name: {props.data?.name}, Desc: {props.value}, Context: {props.context.someAdditionalContext}
</div>
