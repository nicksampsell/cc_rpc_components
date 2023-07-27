import React, {useState, forwardRef, useEffect, useMemo} from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {SortableItem} from './SortableItem'
import {RxDragHandleDots1} from 'react-icons/rx'
import {MdOutlineDragHandle} from 'react-icons/md'
import {RiAddCircleFill} from 'react-icons/ri'
import debounce from 'lodash.debounce';

export const useSearchEmployees = (term) => 
useQuery({
	queryKey: ['getSearchEmployee', term],
	queryFn: async () => {
		const { data } = await axios.get('/Api/ApprovalFlowApi/SearchEmployees/' + term,
		{
			withCredentials: true,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		return data
	},
	enabled: !!term
})

export function ApprovalFlowSearch(props) {

	const [searchTerm, setSearchTerm] = useState('')
	const [resultsList, setResultsList] = useState([])
	const { status, data: searchResults, error, isFetching, isLoading, isSuccess } = useSearchEmployees(searchTerm)

	const changeHandler = (e) => {
		setSearchTerm(e.target.value) 
	}

	useEffect(() => {
		if(typeof(searchResults) !== "undefined")
		{
			setResultsList(searchResults)
		}
	}, [searchResults])

	const debouncedChangeHandler = useMemo(
		() => debounce(changeHandler, 300)
	, []);

	const doSearch = () => {
		setSearchTerm(searchTerm)
	}

	const usedIds = props.items.map(x => (x.id, x.userId));

	return (
		<>
			<form onSubmit={e => {
				e.preventDefault()
				doSearch()
			}}>
				<div className="flex flex-col gap-3 mb-5">
					<label className="form-label">Search Employees</label>
					<input type="text" name="search" value={searchTerm} className="form-control" onChange={e => setSearchTerm(e.target.value)} placeholder="First or Last Name"/>
				</div>
				<div className="text-right">
					<button type="button" className="btn primary" onClick={doSearch}>Search</button>
				</div>
			</form>
			
			{(resultsList && typeof(resultsList) != undefined && resultsList.length > 0 )&& (
			<div className="border mt-5 rounded">
				
				<ul className="divide-y">
					<li className="p-3 font-semibold text-xl bg-gray-200">Search Results</li>

					{(isLoading || isFetching) && ( <li className="p-3">Loading...</li> )}
					{error && ( <li className="p-3">There was a problem fetching your search results.  Please try again later.</li>)}
					{(isSuccess && resultsList.filter(x => !usedIds.includes(x.id)).length == 0) ? 
						( <li className="p-3">There are no employees that match your search request.</li> ) : 

					resultsList.filter(x => !usedIds.includes(x.id)).map(item => (
						<li key={item.id} className="flex flex-row justify-between items-center p-3">
							<div className="flex flex-col gap-3">
								<strong>{item?.fullName}</strong>
								<span>{item?.position?.title}</span>
							</div>
							<button type="button" className="btn text-xl text-green-500 hover:text-green-700 active:text-green-900 active:outline-0 active:ring-0 text-right" onClick={() => {
								props.onAddToList({
									id: item.id,
									user: {
										firstName: item.firstName,
										lastName: item.lastName,
										fullName: item.fullName
									},
									userId: item.id,
									title: item?.position?.title,
									ordinal: null,
									isActive: true,
									isStatic: false
								})

							}}><RiAddCircleFill /></button>
						</li>
					))}
				</ul>
			
			</div>
			)}


		</>
	)
}