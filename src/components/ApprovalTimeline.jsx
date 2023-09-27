import React, {useState, useEffect} from "react";
import { Timeline } from 'primereact/timeline';
import clsx from 'clsx'
import 'primereact/resources/themes/tailwind-light/theme.css'
import capitalize from 'lodash/capitalize'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

export const ApprovalTimeline = ({approvalFlow, rpcStatus, rpcInfo, isExpanded, mini}) => {
	
	const [approvalEvents, setApprovalEvents] = useState([])

	useEffect(() => {


		let allEvents = approvalFlow?.flowItems?.map(item => ({
			id: item.flowItemId,
			approvalId: item.approvalId,
			uuid: generateUUID(item.flowItemId, (item.standInEnabled ? item.standIn : item.userId)),
			name: item.standInEnabled ? item.standInFullName : item.userFullName,
			jobTitle: item.standInEnabled ? item.standInPosition : item.userPosition,
			message: capitalize(determineStatus(item)),
			status: determineStatus(item),
			userId: item.standInEnabled ? item.standIn : item.UserId,
			isCivilServiceCommission: false,
			isDepartmentHead: false
			})
		);

		if(approvalFlow.requiresCivilServiceCommission && !approvalEvents.includes(x => x.id == 'civil_service'))
		{
			allEvents = [...allEvents, {
				id: rpcInfo?.approvalFlow?.id,
				approvalId: rpcInfo?.miscApprovals?.find(x => x.
isCivilServiceCommission == true)?.id,
				uuid: generateUUID(rpcInfo.id, 'civilService'),
				name: rpcInfo?.departmentHead?.fullName,
				jobTitle: 'Civil Service Commission',
				message: capitalize(determineStatus(rpcInfo?.miscApprovals?.find(x => x.
isCivilServiceCommission == true))),
				status: determineStatus(rpcInfo?.miscApprovals?.find(x => x.
isCivilServiceCommission == true)),
				userId: null,
				isCivilServiceCommission: true,
				isDepartmentHead: false
			}]
		}

		if(approvalFlow.requiresDeptHead && !approvalEvents.includes(x => x.id == 'dept_head'))
		{
			allEvents = [{
				id: rpcInfo?.approvalFlow?.id,
				approvalId: rpcInfo?.miscApprovals?.find(x => x.isDeptHead == true)?.id,
				uuid: generateUUID(rpcInfo.id, rpcInfo?.departmentHead?.userId),
				name: rpcInfo?.departmentHead?.fullName,
				jobTitle: rpcInfo?.departmentHead?.positionTitle,
				message: capitalize(determineStatus(rpcInfo?.miscApprovals?.find(x => x.isDeptHead == true))),
				status: determineStatus(rpcInfo?.miscApprovals?.find(x => x.isDeptHead == true)),
				userId: rpcInfo?.departmentHead?.userId,
				isCivilServiceCommission: false,
				isDepartmentHead: true
			}, ...allEvents]
		}	

		setApprovalEvents([...allEvents])

		}, [approvalFlow])



	const determineStatus = (item) => {

		let status = ''; //options: active, success, error, waiting

		/** Rationale for this organization

		Status responses are ranked in importance.
		Approval takes precedence over everything.

		If approval is false, go to the next highest, waiting,
		and see if it is true.  Repeat with all items, ending with "active"

		May not be the best way of doing it, but it solves the problem
		*/

		//console.log(item)

		if(item == undefined)
		{
			return
		}
		if(item.isApproved)
		{
			return 'success'
		}
	
		if(item.requiresModification)
		{
			return 'error';
		}
		if(item.isCreated)
		{
			return 'active';
		}
		
		return 'warning';
				
	}

	const timelineItemWidth = (numItems) => {
		if(numItems == 0)
		{
			numItems = 1;
		}

		return 'w-['+ 100/parseInt(numItems) +'%]';
	}

	const calculateTimelineMinWidth = (numItems) => {
		if(numItems == 0)
		{
			numItems = 1;
		}

		return 'min-w-['+ 110 * parseInt(numItems) +'px]';
	}


	return (
			
		<>
		{!isExpanded ? (
			<>
			{!!approvalEvents ? (
				<>
				<Timeline 
					layout="horizontal"
					align="top"
					value={approvalEvents}
					marker={(item) => ItemMarkerCollapsedDisplay(item, rpcInfo)}
					className="flex"
					pt={{
						root: { className: clsx(calculateTimelineMinWidth(approvalEvents.length)) },
						event: { className: clsx(timelineItemWidth(approvalEvents.length), 'grow') },
						connector: { className: '!bg-black basis-full'},
						separator: { className: 'w-full flex flex-row items-center' },
						content: { className: '' },
						opposite: { className: '' }
					}}
					/>
					


					
					</>
				) : ( 
					<p>There was a problem loading the status of this RPC.  Please check back later.</p> 
				)}
			</>
		) : (

			<div className="overflow-y-auto md:overflow-none w-full">

				{!!approvalEvents ? (
					<>
						<Timeline 
							layout="horizontal"
							align="top"
							value={approvalEvents}
							content={(item) => TimelineItem(item, rpcInfo)}
							opposite={(item) => TimelineStatusText(item)}
							marker={(item) => ItemMarker(item.status)}
							className="grid grid-flow-col-dense auto-cols-fr"
							pt={{
								root: { className: clsx(calculateTimelineMinWidth(approvalEvents.length)) },
								event: { className: clsx(timelineItemWidth(approvalEvents.length),'grow') },
								connector: { className: '!bg-black basis-full'},
								separator: { className: 'w-full flex flex-row items-center' },
								content: { className: '' },
								opposite: { className: '' }
							}}
						/>
					</>
				) : ( 
					<p>There was a problem loading the status of this RPC.  Please check back later.</p> 
				)}
			</div>
		)}
		</>

	)
}

const generateUUID = (approvalFlowId = 0, approvalId = 0) => {

	if(approvalFlowId == 0)
	{
		approvalFlowId = Math.floor(Math.random() * 1024);
	}

	if(approvalId == 0)
	{
		approvalId = Math.floor(Math.random() * 1024);
	}

	return approvalFlowId + '-' + approvalId;
}

const ItemMarkerCollapsedDisplay = (item, rpcInfo) => {
	let bullet = ''
	const uuid = generateUUID(item.approvalFlowId,item.approvalId);
	return (
		<>
		{(item.status == 'success') ? (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-green-400',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-green-400 hover:cursor-pointer" data-tooltip-id={uuid}></div>
			</div>
		) : (item.status == 'error') ? (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-red-400',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-red-400 animate-ping motion-safe:animate-none hover:cursor-pointer" data-tooltip-id={uuid}></div>
			</div>
		) : (item.status == 'waiting' || item.status == 'active') ? (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-sky-300',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-sky-300 animate-ping motion-safe:animate-none hover:cursor-pointer" data-tooltip-id={uuid}></div>
			</div>
		) : (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-white',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-white hover:cursor-pointer" data-tooltip-id={uuid}></div>
			</div>
		)}
		<Tooltip 
			id={uuid } 
			place="bottom" 
			key={uuid} 
			className={clsx( 
				{'!bg-green-600': (item.status == 'success')},
				{'!bg-red-600' : (item.status == 'error') },
				{'!bg-sky-500' : (item.status == 'waiting' || item.status == 'active') },
				'z-50 shadow-lg'

			)}>
			<div className="flex flex-col">
				{item.isCivilServiceCommission ? (
					<strong className="font-semibold">Civil Service Commission</strong>
				) : 
					item.isDepartmentHead ? (
						<>
						<strong className="font-semibold">{rpcInfo?.departmentHead?.fullName}</strong>
						{rpcInfo?.departmentHead?.positionTitle && (
								<p className="italic whitespace-normal">({rpcInfo?.departmentHead?.positionTitle})</p>
							)}
						</>
					) : (
					<>
					<strong className="font-semibold">{item?.name}</strong>
						{item?.jobTitle && (
							<p className="italic whitespace-normal">({item?.jobTitle})</p>
						)}
					</>
				)}
			</div>
		</Tooltip>
		
		</>
	)
}


const colorStatus = (status) => {

	if(status == 'success')
		return 'text-green-600'
	else if(status == 'error')
		return 'text-red-400'
	else if(status == 'waiting')
		return 'text-sky-700'
	else
		return 'text-gray-400'
}


const ItemMarker = (status) => {
	let bullet = ''

	if(status == 'success')
	{
		return (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-green-400',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-green-400"></div>
			</div>
		)
	}
	else if(status == 'error')
	{
		return (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-red-400',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-red-400 animate-ping motion-safe:animate-none"></div>
			</div>
		)
	}
	else if(status == 'waiting' || status == 'active')
	{
		return (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-sky-300',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-sky-300 animate-ping motion-safe:animate-none"></div>
			</div>
		)		
	}
	else
	{
		return (
			<div className={clsx('border-2 rounded-full border-gray-700 bg-white',bullet)}>
				<div className="border-0 rounded-full p-2 relative bg-white"></div>
			</div>
		)
	}
}

const TimelineStatusText = (item) =>
{


	return (
		<div className="w-full">
			<p className={clsx('mt-3 text-sm italic',colorStatus(item.status))}>{item.message ? item.message : " "}</p>
		</div>
	);
}


const TimelineItem = (item, rpcInfo) =>
{
	return (
		<div className="text-xs">
			{item.isCivilServiceCommission ? (
				<strong className="font-semibold">Civil Service Commission</strong>
			) : 
			item.isDepartmentHead ? (
				<>
				<strong className="font-semibold">{rpcInfo.departmentHead}</strong>
				{rpcInfo.departmentHeadTitle && (
						<p className="italic whitespace-normal">({rpcInfo.departmentHeadTitle})</p>
					)}
				</>
			) : (
				<>
				<strong className="font-semibold">{item.name}</strong>
				{item.jobTitle && (
						<p className="italic whitespace-normal">({item.jobTitle})</p>
					)}
				</>
			)}
		</div>
	);
}

