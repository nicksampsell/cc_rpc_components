import React from 'react'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {MdOutlineDragHandle, MdOutlineDeleteForever} from 'react-icons/md'

export function SortableItem(props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition
	} = useSortable({
		id: props.id,
		transition: {
			duration: 150,
			easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
		}
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			
			
			{props.userId != 0 ? (
				<div className="flex flex-row shadow-lg justify-between items-center p-5 gap-5 border bg-white cursor-ns-resize active:cursor-ns-resize">
					<div>
						<MdOutlineDragHandle className="text-2xl"/>
					</div>
					<div className="grow">
					<h2 className="text-xl">{props.user.firstName} {props.user.lastName}</h2>
					<p className="text-sm">{props.title}</p>
					</div>
					<div>
						<button type="button" className="btn danger text-xl"><MdOutlineDeleteForever /></button>
					</div>
				</div>
			) : (
				<div className="flex flex-row items-center p-5 gap-5 border bg-gray-100 cursor-ns-resize active:cursor-ns-resize">
					<div>
						<MdOutlineDragHandle className="text-2xl"/>
					</div>
					<h2 className="text-xl">{props.title}</h2>
				</div>
			)}
		</div>
	)
}