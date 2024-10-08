<script lang="ts">
	import AgGridSvelte5Component from '$lib/AgGridComponent.svelte';
	import { type GridOptions, type ColDef, type Module } from '@ag-grid-community/core';
	import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
	import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
	import { themeQuartz } from '@ag-grid-community/theming';
	interface Car {
		make: string;
		model: string;
		price: number;
		id: number;
	}

	let rowData: Car[] = $state([
		{ id: 1, make: 'Toyota', model: 'Celica', price: 35000 },
		{ id: 2, make: 'Ford', model: 'Mondeo', price: 32000 },
		{ id: 3, make: 'Porsche', model: 'Boxster', price: 72000 }
	]);
	let gridOptions: GridOptions<Car> = $state({
		columnDefs: [
			{ field: 'id' },
			{ field: 'make' },
			{ field: 'model', rowGroup: true },
			{ field: 'price' }
		] as ColDef<Car>[],
		// Important for reducing dom updates and improving performance
		getRowId: (params) => params.data.id.toString(),
		domLayout: 'autoHeight',
		theme: themeQuartz
	});

	setInterval(() => {
		rowData = [
			{ id: 1, make: 'Ford', model: 'Mondeo', price: 32000 },
			{ id: 2, make: 'Toyota', model: 'Celica', price: 35000 },
			{ id: 3, make: 'Porsche', model: 'Boxster', price: rowData[2].price + 1 }
		];
	}, 200);

	const modules: Module[] = [ClientSideRowModelModule, RowGroupingModule];

	// to use myTheme in an application, pass it to the theme grid option
	const myTheme = themeQuartz.withParams({
		accentColor: '#EE28ED',
		backgroundColor: '#1f2836',
		browserColorScheme: 'dark',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#FFF',
		headerFontSize: 14
	});

	const myTheme2 = themeQuartz.withParams({
		accentColor: '#33E34B',
		backgroundColor: '#EC111C',
		browserColorScheme: 'dark',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#FFF',
		headerFontSize: 14
	});

	let selectedTheme = $state(myTheme);

	$inspect(selectedTheme);
</script>

<div>
	<AgGridSvelte5Component {gridOptions} {rowData} theme={selectedTheme} {modules} />
	<button onclick={() => (selectedTheme = selectedTheme === myTheme ? myTheme2 : myTheme)}
		>Change Theme</button
	>
</div>
