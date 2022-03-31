Name: globalnoc-worldview-panel
Version: 1.1.2
Release: 1%{?dist}
Summary: Network Map Panel For Grafana

Group: GRNOC
License: GRNOC
URL: https://github.grnoc.iu.edu/NDCA/grafana-react-network-map-panel.git
Source0: %{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root
BuildArch: noarch

BuildRequires: nodejs

%description
Network map panel for Grafana that uses the Atlas4 library to construct its maps

%prep
%setup -q -n globalnoc-worldview-panel-%{version}

%build
yarn install
yarn build

%install
rm -rf $RPM_BUILD_ROOT

%{__install} -d -p %{buildroot}/var/lib/grafana/plugins/globalnoc-worldview-panel/dist # Plugin Directory
cp -a dist/. %{buildroot}/var/lib/grafana/plugins/globalnoc-worldview-panel/dist

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(644, root, root, 755)
/var/lib/grafana/plugins/globalnoc-worldview-panel/dist
