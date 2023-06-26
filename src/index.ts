import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';


joplin.plugins.register({
	onStart: async function() {
		console.info('Hello world. Test plugin started!');

		await joplin.workspace.onSyncStart(async (evt) => {
			console.info('Hello world. Test plugin called!');
			var now_notes = (await joplin.data.get(['search'], { query:'iscompleted:0 tag:01-Now', fields: ['id', 'title', 'todo_completed', 'body', 'todo_due'] })).items as any[]
			var next_notes = (await joplin.data.get(['search'], { query:'iscompleted:0 tag:02-Next', fields: ['id', 'title', 'todo_completed', 'body', 'todo_due'] })).items as any[]
			var soon_notes = (await joplin.data.get(['search'], { query:'iscompleted:0 tag:03-Soon', fields: ['id', 'title', 'todo_completed', 'body', 'todo_due'] })).items as any[]
			var later_notes = (await joplin.data.get(['search'], { query:'iscompleted:0 tag:04-Later', fields: ['id', 'title', 'todo_completed', 'body', 'todo_due'] })).items as any[]
			//console.info(now_notes)
			var due = Date.now()

			// Later should be done within two weeks
			due = Date.now();
			due = due + (1000 * 60 * 60 * 24 * 14);
			for (var i in later_notes){
				if(later_notes[i].todo_due == 0){
					joplin.data.put(['notes', later_notes[i].id], null, {todo_due: due}, null);
				}
			}
			// soon should be done within one week
			due = Date.now();
			due = due + (1000 * 60 * 60 * 24 * 7);
			for (var i in soon_notes){
				if(soon_notes[i].todo_due == 0){
					joplin.data.put(['notes', soon_notes[i].id], null, {todo_due: due}, null);
				}
			}
			// next should be done within 48 hours
			due = Date.now();
			due = due + (1000 * 60 * 60 * 24 * 2);
			for (var i in next_notes){
				if(next_notes[i].todo_due == 0){
					joplin.data.put(['notes', next_notes[i].id], null, {todo_due: due}, null);
				}
			}
			// now should be done within 24 hours
			due = Date.now();
			due = due + (1000 * 60 * 60 * 24 * 1);
			for (var i in now_notes){
				if(now_notes[i].todo_due == 0){
					joplin.data.put(['notes', now_notes[i].id], null, {todo_due: due}, null);
				}
			}
		})

		await joplin.commands.register({
			name: 'reset_gtd_due_dates',
			label: 'Reset GTD Due Dates',
			iconName: 'fas fa-music',
			execute:async () => {
				var now_notes = (await joplin.data.get(['search'], { query:'notebook:"00 - Tasks" iscompleted:0', fields: ['id', 'title', 'todo_completed', 'body', 'todo_due'] })).items as any[]
				for (var i in now_notes){
					if(now_notes[i].todo_due != 0){
						joplin.data.put(['notes', now_notes[i].id], null, {todo_due: 0}, null);
					}
				}
			},
		})
		
		var item = await joplin.views.menuItems.create('reset_gtd_due_dates_menu_item', 'reset_gtd_due_dates', MenuItemLocation.Tools)
		//joplin.views.menus.create('auto_due_date_menu', 'Auto Due Date', [item], MenuItemLocation.Tools)
	},
});


