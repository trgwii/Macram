'use strict';

// Testing different libs for deep traversal

const deepMap = require('./deepMap');

console.log(JSON.stringify(deepMap(x => {
	if (
		x &&
		x.name === 'collapse' &&
		x.children.length === 1
	) {
		return x.children[0];
	}
	return x;
}, {
	name: 'root',
	children: [
		{
			name: 'collapse',
			children: [
				{
					name: 'a',
					children: [
						{
							name: 'b',
							children: []
						},
						0
					]
				}
			]
		}
	]
}), null, '  '));
