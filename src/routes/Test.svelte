<script module>
	import { SvelteRendererComp } from '$lib/helpers.svelte.js';
	import type { ICellRendererComp, ICellRendererParams } from '@ag-grid-community/core';
	import { mount } from 'svelte';
	import Test from './Test.svelte';

	export interface TestCompContext {
		someAdditionalContext: string;
	}

	export interface TestCustomCellData {
		name: string;
		desc: string;
	}

	export class TestComp extends SvelteRendererComp {
		render() {
			this.comp = mount(Test, {
				target: this.eGui!,
				props: this.params
			});
		}
	}
</script>

<script lang="ts">
	let props: ICellRendererParams<TestCustomCellData, string, TestCompContext> = $props();
</script>

<div>Hi {props.data?.name}, Age: {props.value}, Context: {props.context.someAdditionalContext}</div>
