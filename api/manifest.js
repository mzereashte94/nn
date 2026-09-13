export default async function handler(req, res) {
    const { ipa, bundle_url, app } = req.query;
    if (!ipa || !app) return res.status(400).send('Invalid Request');

    // گۆڕینی ئایکۆنەکان بۆ ئەوانەی پڕۆژەی AshteMobile
    const customIcons = {
        'ashtemobile': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Ashtemobile.jpeg',
        'esign': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Esign.jpeg',
        'ksign': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Ksign.jpeg',
        'mytv': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/mytv.jpeg'
    };

    // دانانی AshteMobile وەک ئایکۆنی بنەڕەتی
    const iconUrl = customIcons[app.toLowerCase()] || customIcons['ashtemobile'];
    // گۆڕینی Bundle ID بۆ AshteMobile
    let actualBundleId = `com.ashtemobile.${app.toLowerCase()}`;

    try {
        if (bundle_url) {
            const bundleRes = await fetch(bundle_url);
            if (bundleRes.ok) {
                actualBundleId = (await bundleRes.text()).trim();
            }
        }
    } catch (e) {
        console.error("Failed to fetch bundle ID");
    }

    const manifestXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>${ipa}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>needs-shine</key>
                    <true/>
                    <key>url</key>
                    <string>${iconUrl}</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>${actualBundleId}</string>
                <key>bundle-version</key>
                <string>1.0.0</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <!-- گۆڕینی ناوی ئەپەکە لە کاتی دابەزاندندا -->
                <string>${app} - AshteMobile</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(manifestXML);
}
