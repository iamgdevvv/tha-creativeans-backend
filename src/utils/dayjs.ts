import dayjsX from 'dayjs';
import 'dayjs/locale/id';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';

dayjsX.extend(dayjsUTC);
dayjsX.extend(dayjsTimezone);
dayjsX.extend(dayjsLocalizedFormat);
dayjsX.locale('id');

export default function dayjs(date?: dayjsX.ConfigType, timezone?: number) {
	return dayjsX(date)
		.startOf('day')
		.utcOffset(timezone || 7, true);
}
