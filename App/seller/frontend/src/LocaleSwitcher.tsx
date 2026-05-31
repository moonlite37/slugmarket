import { useTranslation } from 'react-i18next';
import { supportedLngs } from './utils/i18n';

function LocaleSwitcher() {
	const { i18n } = useTranslation();

	return (
		<select
			value={i18n.language}
			onChange={(e) => {
				void i18n.changeLanguage(e.target.value);
			}}
		>
			{Object.entries(supportedLngs).map(([code, name]) => (
				<option key={code} value={code}>
					{name}
				</option>
			))}
		</select>
	);
}

export default LocaleSwitcher;
